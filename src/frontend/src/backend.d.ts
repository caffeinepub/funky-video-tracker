import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoStatus {
    watched = "watched",
    noResponse = "noResponse",
    notInterested = "notInterested",
    watchLater = "watchLater"
}
export interface backendInterface {
    addVideo(url: string, title: string, thumbnailUrl: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminDashboard(): Promise<[Array<string>, Array<string>]>;
    getAllVideoEngagements(_videoId: string): Promise<Array<string>>;
    getAllVideos(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<string | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<string | null>;
    getUserVideoStatus(_user: Principal, _videoId: string): Promise<VideoStatus>;
    getUsersWithoutResponse(_videoId: string): Promise<Array<Principal>>;
    getVideo(_videoId: string): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(): Promise<void>;
    setUserVideoStatus(_videoId: string, _status: VideoStatus): Promise<void>;
}
