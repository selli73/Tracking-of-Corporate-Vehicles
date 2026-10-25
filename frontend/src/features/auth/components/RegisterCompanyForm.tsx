import { useState, type ChangeEvent, type FormEvent } from "react";
import type { RegisterCompanyDto } from "../types";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { authStore } from "../store";
import { getRegisterErrorMessage } from "../errors";


interface FormValues {
    officialName: string;
    shortName: string;
    tin: string;
    registeredAddress: string;
    actualAddress: string;
    phone: string;
    companyEmail: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

const EMPTY: FormValues = {
  officialName: '',
  shortName: '',
  tin: '',
  registeredAddress: '',
  actualAddress: '',
  phone: '',
  companyEmail: '',
  surname: '',
  name: '',
  email: '',
  password: '',
  passwordRepeat: '',
};

function toDto(values: FormValues): RegisterCompanyDto {
  const actualAddress = values.actualAddress.trim();

  return {
    company: {
      officialName: values.officialName.trim(),
      shortName: values.shortName.trim(),
      tin: values.tin.trim(),
      registeredAddress: values.registeredAddress.trim(),
      actualAddress: actualAddress || undefined,
      phone: values.phone.trim(),
      companyEmail: values.companyEmail.trim().toLowerCase(),
    },
    owner: {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      name: values.name.trim(),
      surname: values.surname.trim(),
    },
  };
}

export const RegisterCompanyForm = () => {
    const [values, setValues] = useState<FormValues>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    function update(field: keyof FormValues) {
        return (event: ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }));        
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (values.password !== values.passwordRepeat) {
            setError('Пароли не совпадают');
            return;
        }

        setIsSubmitting(true);
        try {
            await authStore.registerCompany(toDto(values));
        } catch (error) {
            setError(getRegisterErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Компания</legend>

                <div>
                    <label htmlFor="officialName">Полное название</label>
                    <input
                        id="officialName"
                        required
                        maxLength={150}
                        placeholder="ООО «Ромашка»"
                        value={values.officialName}
                        onChange={update('officialName')}
                    />
                </div>

                <div>
                    <label htmlFor="shortName">Короткое название</label>
                    <input
                        id="shortName"
                        required
                        maxLength={30}
                        placeholder="Ромашка"
                        value={values.shortName}
                        onChange={update('shortName')}
                    />
                </div>

                <div>
                    <label htmlFor="tin">ИНН</label>
                    <input
                        id="tin"
                        required
                        inputMode="numeric"
                        pattern="\d{10}|\d{12}"
                        maxLength={12}
                        title="10 цифр для организации или 12 цифр для ИП"
                        value={values.tin}
                        onChange={update('tin')}
                    />
                </div>

                <div>
                    <label htmlFor="registeredAddress">Юридический адрес</label>
                    <input
                        id="registeredAddress"
                        required
                        maxLength={150}
                        value={values.registeredAddress}
                        onChange={update('registeredAddress')}
                    />
                </div>

                <div>
                    <label htmlFor="actualAddress">Фактический адрес (если отличается)</label>
                    <input
                        id="actualAddress"
                        maxLength={150}
                        value={values.actualAddress}
                        onChange={update('actualAddress')}
                    />
                </div>

                <div>
                    <label htmlFor="phone">Телефон</label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        pattern="\+?\d{10,14}"
                        maxLength={15}
                        placeholder="+79991234567"
                        title="От 10 до 14 цифр, можно с плюсом в начале"
                        value={values.phone}
                        onChange={update('phone')}
                    />
                </div>

                <div>
                    <label htmlFor="companyEmail">Email компании</label>
                    <input
                        id="companyEmail"
                        type="email"
                        required
                        maxLength={120}
                        value={values.companyEmail}
                        onChange={update('companyEmail')}
                    />
                </div>
            </fieldset>

            <fieldset>
                <legend>Владелец</legend>

                <div>
                    <label htmlFor="surname">Фамилия</label>
                    <input id="surname" required maxLength={35} value={values.surname} onChange={update('surname')} />
                </div>

                <div>
                    <label htmlFor="name">Имя</label>
                    <input id="name" required maxLength={25} value={values.name} onChange={update('name')} />
                </div>

                <div>
                    <label htmlFor="email">Email для входа</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={values.email}
                        onChange={update('email')}
                    />
                </div>

                <div>
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                        value={values.password}
                        onChange={update('password')}
                    />
                </div>

                <div>
                    <label htmlFor="passwordRepeat">Повторите пароль</label>
                    <input
                        id="passwordRepeat"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={values.passwordRepeat}
                        onChange={update('passwordRepeat')}
                    />
                </div>
            </fieldset>

            {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Регистрируем…' : 'Зарегистрировать'}
            </button>
        </form>
    );
}