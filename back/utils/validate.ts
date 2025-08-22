export type ValidateType = 'email' | 'username' | 'password' | 'notes';
export type Validate = {
  code: number;
  message: string;
  output: ValidateType;
}
const validate = (input: any, type:ValidateType): Validate<ValidateType> => {

}
