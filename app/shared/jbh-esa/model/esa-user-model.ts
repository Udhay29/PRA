export interface UrlAccessModel {
    uri: string;
    accessLevel: number;
}

export interface UserDetailsModel {
    userId: string;
    firstName: string;
    lastName: string;
    runtimeEnvironment: string | null;
    profilePicture: string | null;
    auditUserInfo: string | null;
    urlAccessList: Array<UrlAccessModel>;
    username: string | null;
    password: string | null;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    authorities: string | null;
    status: string;
    dataList?: any;
}

export class EsaUserModel {
    userDetails: UserDetailsModel;
}
