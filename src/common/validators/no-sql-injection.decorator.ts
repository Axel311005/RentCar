import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

const SQL_INJECTION_PATTERN =
  /(\b(select|insert|update|delete|drop|union|alter|create|truncate)\b|--|;|'|"|\/\*|\*\/)/i;

export function NoSqlInjection(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'NoSqlInjection',
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
          return !SQL_INJECTION_PATTERN.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contiene patrones no permitidos`;
        },
      },
    });
  };
}
