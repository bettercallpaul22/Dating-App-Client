export interface RegisterResponse {
    success: boolean;
    token: string;
}

export interface MyTokenResponse {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        city: string;
        state: string;
        country: string;
        avatar: string;
        age: number;
        gender: string;
    }

}

export interface MyTokenResponse {

    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    state: string;
    country: string;
    avatar: string;
    age: number;
    gender: string;


}

export interface MyChatResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
    members: string[];
}

export interface User {

    _id: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    height: number;
    orientation_: string;
    bodyType: string;
    ethnicity: string;
    hasChildren: string;
    genderInterest: string;
    religion: string;
    followers: string[];
    about: string;
    gender: string;
    avatar: string;
    city: string;
    state: string;
    country: string;
    status: string;
    password: string;
}

export interface MessageResponse {
    _id: string;
    conversationId: string;
    createdAt: string;
    senderId: string;
    text: string;
    updatedAt: string;
}

export interface ConversationResponse {
    _id: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
}
export interface RequestDataResponse {
    _id: string;
    senderId: string;
    recipientId: string;
    firstName: string;
    lastName: string;
    avatar: string;
    age: number;
    gender: string;
    text: string;
    bill: string;
    city: string;
    state: string;
    country: string;
    createdAt: string;
    updatedAt: string;
}
