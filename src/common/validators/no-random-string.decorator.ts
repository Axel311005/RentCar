import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NoRandomString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'NoRandomString',
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

          const normalized = value.trim();
          if (!normalized) {
            return false;
          }

          const hasVowel = /[aeiouáéíóúü]/i.test(normalized);
          const hasConsonant = /[bcdfghjklmnñpqrstvwxyz]/i.test(normalized);
          return hasVowel || hasConsonant;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} parece ser texto inválido`;
        },
      },
    });
  };
}
