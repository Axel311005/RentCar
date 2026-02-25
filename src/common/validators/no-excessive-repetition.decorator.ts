import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NoExcessiveRepetition(
  maxRepetitions = 4,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'NoExcessiveRepetition',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxRepetitions],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (value === null || value === undefined) {
            return true;
          }
          if (typeof value !== 'string') {
            return false;
          }

          const [max] = args.constraints as [number];
          const pattern = new RegExp(`(.)\\1{${Math.max(max - 1, 1)},}`);
          return !pattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [max] = args.constraints as [number];
          return `${args.property} no debe tener más de ${max} caracteres repetidos consecutivos`;
        },
      },
    });
  };
}
