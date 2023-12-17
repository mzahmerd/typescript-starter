export type LoginType = {
    phoneNumber: string;
    // email: string;
    password: string;
};

export type SignUpType = {
    email: string;
    phoneNumber: string;
    password: string;
    firstName: string;
    lastName?: string;
};
