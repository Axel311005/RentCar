import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { NoSqlInjection } from 'src/common/validators/no-sql-injection.decorator';



export class LoginUserDto {

    @ApiProperty()
    @IsString()
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
    @Matches(
        /^[a-zA-Z0-9._%+-]{6,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        {
            message: 'El correo debe tener al menos 6 caracteres antes del @'
        }
    )
    @NoSqlInjection()
    // No aplicamos NoRandomString ni NoExcessiveRepetition porque el email ya tiene validación estricta
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;


    
}