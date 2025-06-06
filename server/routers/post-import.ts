import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import Redis from 'ioredis'
import { redisKeys } from '@/lib/redisKeys'

// Task expiration time (24 hours)
const TASK_EXPIRY = 60 * 60 * 24

const redis = new Redis(process.env.REDIS_URL!)

// Import task status types
export type ImportTaskStatus =
  | 'pending'    // Waiting to be processed
  | 'extracting' // Extracting web content
  | 'analyzing'  // Analyzing content
  | 'converting' // Converting format
  | 'completed'  // Task completed
  | 'failed'     // Task failed

// Imported post data
export interface PostData {
  title: string
  content: string
  contentFormat?: 'html' | 'markdown' | 'plate' // Content format
  url?: string
}

// Import task structure
export interface ImportTask {
  id: string
  url: string
  siteId: string
  status: ImportTaskStatus
  progress: number
  error?: string
  result?: PostData[]
  createdAt: Date
  updatedAt: Date
}

export const postImportRouter = router({
  // Create import task
  createImportTask: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        url: z.string().url()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { siteId, url } = input
      const userId = ctx.token.uid
      
      // Verify user has permission to operate on this site
      if (ctx.activeSiteId !== siteId || !userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to import to this site'
        })
      }
      
      // Create new import task
      const taskId = uuidv4()
      const now = new Date()
      
      const task: ImportTask = {
        id: taskId,
        url,
        siteId,
        status: 'pending',
        progress: 0,
        createdAt: now,
        updatedAt: now
      }
      
      // Save task to Redis
      await redis.set(
        redisKeys.postImportTasks(taskId),
        JSON.stringify(task),
        'EX',
        TASK_EXPIRY
      )
      
      // Return task info
      return task
    }),
    
  // Get import task status
  getImportTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string()
      })
    )
    .query(async ({ input }) => {
      const { taskId } = input
      
      // Get task info from Redis
      const taskData = await redis.get(redisKeys.postImportTasks(taskId))
      
      if (!taskData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Import task not found'
        })
      }
      
      // Parse task data
      const task = JSON.parse(taskData) as ImportTask
      
      // Ensure dates are Date objects
      task.createdAt = new Date(task.createdAt)
      task.updatedAt = new Date(task.updatedAt)
      
      return task
    }),
})
