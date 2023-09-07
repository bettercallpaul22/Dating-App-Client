
export interface SignupResponse{
    success:boolean;
    user:User;
}


export interface Product{
name:string;
price:number;
color:string;
desc:string;
category:string[];
tags:string[];

}




export interface User{
    firstName: string;
    lastName: string;
    email: string;
    mobile:number;
    products: Product;
}