export type SubscriptionInSession = {
  planId: number
  startTime: number
  duration: number
}

export interface SessionData {
  isLoggedIn: boolean
  uid: string
  address: string
  name: string
  picture: string
  image: string
  userId: string
  ensName: string | null
  role: string
  siteId: string
  activeSiteId: string
  planType: string
  currentPeriodEnd: string
  billingCycle: string
  subscriptionStatus: string
  accessToken: string
  believerPeriodEnd: string
  domain: {
    domain: string
    isSubdomain: boolean
  }
  subscriptions: SubscriptionInSession[]
  message: string
}

export type GoogleLoginInfo = {
  email: string
  openid: string
  picture: string
  name: string
}

export type LoginData =
  | GoogleLoginData
  | WalletLoginData
  | PasswordLoginData
  | RegisterByEmailData
  | FarcasterLoginData

export type GoogleLoginData = GoogleLoginInfo & {
  type: 'penx-google'
}

export type WalletLoginData = {
  type: 'wallet'
  message: string
  signature: string
}

export type PasswordLoginData = {
  type: 'password'
  username: string
  password: string
}

export type RegisterByEmailData = {
  type: 'register-by-email'
  validateToken: string
}

export type FarcasterLoginData = {
  type: 'penx-farcaster'
  message: string
  signature: string
  name: string
  pfp: string
}

export function isGoogleLogin(value: any): value is GoogleLoginData {
  return typeof value === 'object' && value?.type === 'penx-google'
}

export function isWalletLogin(value: any): value is WalletLoginData {
  return typeof value === 'object' && value?.type === 'wallet'
}

export function isPasswordLogin(value: any): value is PasswordLoginData {
  return typeof value === 'object' && value?.type === 'password'
}

export function isRegisterByEmail(value: any): value is RegisterByEmailData {
  return typeof value === 'object' && value?.type === 'register-by-email'
}

export function isFarcasterLogin(value: any): value is FarcasterLoginData {
  return typeof value === 'object' && value?.type === 'penx-farcaster'
}

export type UpdateSessionData =
  | UpdateActiveSiteData
  | UpdateProfileData
  | UpdateSubscriptionData
  | CancelSubscriptionData

export type UpdateActiveSiteData = {
  type: 'update-active-site'
  activeSiteId: string
}

export function isUpdateActiveSite(value: any): value is UpdateActiveSiteData {
  return typeof value === 'object' && value?.type === 'update-active-site'
}

export type UpdateProfileData = {
  type: 'update-profile'
  image: string
  displayName: string
  bio: string
}

export function isUpdateProfile(value: any): value is UpdateProfileData {
  return typeof value === 'object' && value?.type === 'update-profile'
}

export type UpdateSubscriptionData = {
  type: 'update-subscription'
}

export function isUpdateSubscription(
  value: any,
): value is UpdateSubscriptionData {
  return typeof value === 'object' && value?.type === 'update-subscription'
}

export type CancelSubscriptionData = {
  type: 'cancel-subscription'
  siteId: string
}

export function isCancelSubscription(
  value: any,
): value is CancelSubscriptionData {
  return typeof value === 'object' && value?.type === 'cancel-subscription'
}
