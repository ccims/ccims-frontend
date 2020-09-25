import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



/** The Payload/Response for the public registerUser mutation */
export type RegisterUserPayload = {
  /** The ID of the user created by this mutation */
  userId?: Maybe<Scalars['ID']>;
};

/** The inputs for the registerUser mutation */
export type RegisterUserInput = {
  /**
   * The unique username used for login.
   * 
   * Max. 100 characters.
   */
  username: Scalars['String'];
  /**
   * The name of the user to display in the GUI.
   * 
   * Max. 200 characters.
   */
  displayName: Scalars['String'];
  /** The password for the new user in plain text */
  password: Scalars['String'];
  /**
   * The mail address of the user.
   * 
   * Max. 320 characters. Must be a valid email address
   */
  email?: Maybe<Scalars['String']>;
};

/** Queries which are public and don't require authentication */
export type Query = {
  /**
   * Checks wether the given username is still available or already taken.
   * 
   * `true` is returned if the username is available and __NOT__ take
   * `false, if it __IS__ already taken and can't be used for a new user
   */
  checkUsername?: Maybe<Scalars['Boolean']>;
};


/** Queries which are public and don't require authentication */
export type QueryCheckUsernameArgs = {
  username: Scalars['String'];
};

/** Mutations which are public and don't require authentication */
export type Mutation = {
  /** Registers/creates a new user in the ccims system */
  registerUser?: Maybe<RegisterUserPayload>;
};


/** Mutations which are public and don't require authentication */
export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { registerUser?: Maybe<Pick<RegisterUserPayload, 'userId'>> };

export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
  registerUser(input: $input) {
    userId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    document = RegisterUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }