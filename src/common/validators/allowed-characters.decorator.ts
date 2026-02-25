import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

const ALLOWED_CHARACTERS_REGEX = /^[\p{L}\p{N}\s.,'"()\-_/+]*$/u;

export function AllowedCharacters(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'AllowedCharacters',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === null || value === undefined) {
            return true;
          }
          if (typeof value !== 'string') {
            return false;
          }
          return ALLOWED_CHARACTERS_REGEX.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contiene caracteres no permitidos`;
        },
      },
    });
  };
}
