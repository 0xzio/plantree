import { Post, Site } from '@prisma/client'
import { Octokit } from 'octokit'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

interface SharedParams {
  owner: string
  repo: string
  headers: {
    'X-GitHub-Api-Version': string
  }
}

type Content = {
  content?: string
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: 'file' | 'dir'
}

export class SyncService {
  password: any

  private params: SharedParams

  private app: Octokit

  private baseBranchSha: string

  private site: Site
  private post: Post

  spacesDir = 'spaces'

  filesTree: Content[]

  commitSha: string

  get baseBranchName() {
    return 'main'
  }

  setSharedParams() {
    const sharedParams = {
      owner: 'penx-dao',
      repo: 'hub',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
    this.params = sharedParams
  }

  static async init(token: string) {
    const s = new SyncService()
    s.setSharedParams()
    s.app = new Octokit({ auth: token })

    return s
  }

  private async updateRef(commitSha: string = '') {
    const branchName = this.baseBranchName
    await this.app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      ...this.params,
      ref: `heads/${branchName}`,
      sha: commitSha,
      force: true,
    })
  }

  private async commit(treeSha: string) {
    const parentSha = this.baseBranchSha
    const msg = this.post ? 'Push post' : 'Push site'

    const commit = await this.app.request(
      'POST /repos/{owner}/{repo}/git/commits',
      {
        ...this.params,
        message: `${msg}`,
        parents: [parentSha],
        tree: treeSha,
      },
    )
    return commit
  }

  async getBaseBranchInfo() {
    const ref = await this.app.request(
      'GET /repos/{owner}/{repo}/git/ref/{ref}',
      {
        ...this.params,
        ref: `heads/${this.baseBranchName}`,
      },
    )

    const refSha = ref.data.object.sha

    this.baseBranchSha = refSha
  }

  async getSiteTree() {
    let tree: TreeItem[] = []
    const item = {
      path: `sites/${this.site.id}.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(this.site, null, 2),
    } as TreeItem

    tree.push(item)

    return tree
  }

  async getPostTree() {
    let tree: TreeItem[] = []
    const item = {
      path: `users/${this.post.userId}/${this.post.id}.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(this.post, null, 2),
    } as TreeItem

    tree.push(item)

    return tree
  }

  async pushSite(site: Site) {
    this.site = site
    let tree: TreeItem[] = []
    tree = await this.getSiteTree()
    await this.pushTree(tree)
  }

  async pushPost(post: Post) {
    this.post = post
    let tree: TreeItem[] = []
    tree = await this.getPostTree()
    await this.pushTree(tree)
  }

  async pushTree(tree: TreeItem[]) {
    // console.log('===========push tree....')
    await this.getBaseBranchInfo()

    // update tree to GitHub before commit
    const { data } = await this.app.request(
      'POST /repos/{owner}/{repo}/git/trees',
      {
        ...this.params,
        tree,
        base_tree: this.baseBranchSha,
      },
    )

    // create a commit for the tree
    const { data: commitData } = await this.commit(data.sha)

    // update ref to GitHub server after commit
    await this.updateRef(commitData.sha)
  }
}
