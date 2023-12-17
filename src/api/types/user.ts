export type CreateUserType = {
    roleId?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    email: string;
    password: string;
};

export type UpdateUserType = {
    roleId?: number;
    firstName: string;
    lastName: string;
};
