import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const hasLowerCase = /(?=.*[a-z])/.test(password);
    const hasUpperCase = /(?=.*[A-Z])/.test(password);
    const hasNumber = /(?=.*\d)/.test(password);
    const minLength = password.length >= 8;

    return hasLowerCase && hasUpperCase && hasNumber && minLength;
  }

  defaultMessage() {
    return 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number';
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
