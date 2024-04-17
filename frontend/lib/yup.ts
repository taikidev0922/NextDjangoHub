import * as yup from "yup";

export type MessageParams = {
  path: string; // 変数名
  value: any;
  originalValue: any;
  label: string;
  type: string;
};

const labelText = (prm: MessageParams) => {
  return prm.label !== "" ? `${prm.label}は` : "";
};

const jpConfig = {
  mixed: {
    default: (prm: MessageParams) => `${labelText(prm)}無効です`,
    required: (prm: MessageParams) => `${labelText(prm)}必須の入力項目です`,
    oneOf: (prm: MessageParams & { values: any }) =>
      `${labelText(prm)}次の値のいずれかを入力してください:${prm.values}`,
    notOneOf: (prm: MessageParams & { values: any }) =>
      `${labelText(prm)}次の値のいずれかを入力してください:${prm.values}`,
    notType: `形式が違います`,
    defined: ``,
  },
  string: {
    length: (prm: MessageParams & { length: number }) =>
      `${labelText(prm)}${prm.length}文字で入力してください`,
    min: (prm: MessageParams & { min: number }) =>
      `${labelText(prm)}少なくとも${prm.min}文字で入力してください`,
    max: (prm: MessageParams & { max: number }) =>
      `${labelText(prm)}最大${prm.max}文字で入力してください`,
    matches: (prm: MessageParams & { regex: RegExp }) =>
      `${labelText(prm)}次の形式と一致する必要があります: "${prm.regex}"`,
    email: (prm: MessageParams & { regex: RegExp }) =>
      `${labelText(prm)}メールアドレス形式で入力してください`,
    url: (prm: MessageParams & { regex: RegExp }) =>
      `${labelText(prm)}有効なURLを入力してください`,
    uuid: (prm: MessageParams & { regex: RegExp }) =>
      `${labelText(prm)}有効なUUIDを入力してください`,
    trim: (prm: MessageParams) =>
      `${labelText(prm)}前後にスペースを入れずに入力してください`,
    lowercase: (prm: MessageParams) =>
      `${labelText(prm)}小文字で入力してください`,
    uppercase: (prm: MessageParams) =>
      `${labelText(prm)}大文字で入力してください`,
    zenHiragana: (prm: MessageParams) =>
      `${labelText(prm)}全角ひらがなで入力してください`,
    zenKatakana: (prm: MessageParams) =>
      `${labelText(prm)}全角カタカナで入力してください`,
    hanNumber: (prm: MessageParams) =>
      `${labelText(prm)}半角数字で入力してください`,
    hanAlphaNumber: (prm: MessageParams) =>
      `${labelText(prm)}半角英数字で入力してください`,
    hanAlphaNumberSymbol: (prm: MessageParams) =>
      `${labelText(prm)}半角英数字記号で入力してください`,
  },
  number: {
    min: (prm: MessageParams & { min: number }) =>
      `${labelText(prm)}${prm.min}以上の数字を入力してください`,
    max: (prm: MessageParams & { max: number }) =>
      `${labelText(prm)}${prm.max}以下の数字を入力してください`,
    lessThan: (prm: MessageParams & { less: number }) =>
      `${labelText(prm)}${prm.less}より小さい数字を入力してください`,
    moreThan: (prm: MessageParams & { more: number }) =>
      `${labelText(prm)}${prm.more}より大きい数字を入力してください`,
    positive: (prm: MessageParams & { more: number }) =>
      `${labelText(prm)}正の数で入力してください`,
    negative: (prm: MessageParams & { less: number }) =>
      `${labelText(prm)}負の数で入力してください`,
    integer: (prm: MessageParams) => `${labelText(prm)}整数で入力してください`,
  },
  date: {
    min: (prm: MessageParams & { min: Date | string }) =>
      `${labelText(prm)}${String(prm.min)}より後で入力してください`,
    max: (prm: MessageParams & { max: Date | string }) =>
      `${labelText(prm)}${String(prm.max)}より前で入力してください`,
  },
  boolean: {
    isValue: (prm: MessageParams) => `${labelText(prm)}値が必要です`,
  },
  object: {
    noUnknown: (prm: MessageParams) =>
      `${labelText(prm)}オブジェクトシェイプで指定されていないキーを含めることはできません`,
  },
  array: {
    length: (prm: MessageParams & { length: number }) =>
      `${labelText(prm)}${prm.length}個が必要です`,
    min: (prm: MessageParams & { min: number }) =>
      `${labelText(prm)}${prm.min}個以上の項目が必要です`,
    max: (prm: MessageParams & { max: number }) =>
      `${labelText(prm)}${prm.max}個以下の項目が必要です`,
  },
};

yup.setLocale(jpConfig);

type StringValidationType = {
  name: string;
  errorMessage: (prm: MessageParams) => string;
  isValid: (value: string) => boolean;
};

const stringValidationList: StringValidationType[] = [
  {
    name: "zenHiragana",
    errorMessage: jpConfig.string.zenHiragana,
    isValid: (value: string) => {
      return /^[ぁ-んー]*$/.test(value);
    },
  },
  {
    name: "zenHiraganaWithSpace",
    errorMessage: jpConfig.string.zenHiragana,
    isValid: (value: string) => {
      return /^[ぁ-んー　]*$/.test(value);
    },
  },
  {
    name: "zenKatakana",
    errorMessage: jpConfig.string.zenKatakana,
    isValid: (value: string) => {
      return /^[ァ-ンヴー]*$/.test(value);
    },
  },
  {
    name: "zenKatakanaWithSpace",
    errorMessage: jpConfig.string.zenKatakana,
    isValid: (value: string) => {
      return /^[ァ-ンヴー　]*$/.test(value);
    },
  },
  {
    name: "hanNumber",
    errorMessage: jpConfig.string.hanNumber,
    isValid: (value: string) => {
      return /^[0-9]*$/.test(value);
    },
  },
  {
    name: "hanAlphaNumber",
    errorMessage: jpConfig.string.hanAlphaNumber,
    isValid: (value: string) => {
      return /^[0-9a-zA-Z]*$/.test(value);
    },
  },
  {
    name: "hanAlphaNumberSymbol",
    errorMessage: jpConfig.string.hanAlphaNumberSymbol,
    isValid: (value: string) => {
      return /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/.test(value);
    },
  },
];

stringValidationList.forEach((validation) => {
  yup.addMethod<yup.StringSchema>(
    yup.string,
    validation.name,
    function (message: yup.Message = validation.errorMessage) {
      return this.test(function (value, testContext) {
        if (value == null || value === "") {
          return true;
        }
        if (validation.isValid(value)) {
          return true;
        }
        return testContext.createError({
          message,
        });
      });
    }
  );
});

declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    zenHiragana(): StringSchema<TType, TContext, TDefault, TFlags>;
    zenHiraganaWithSpace(): StringSchema<TType, TContext, TDefault, TFlags>;
    zenKatakana(): StringSchema<TType, TContext, TDefault, TFlags>;
    zenKatakanaWithSpace(): StringSchema<TType, TContext, TDefault, TFlags>;
    hanNumber(): StringSchema<TType, TContext, TDefault, TFlags>;
    hanAlphaNumber(): StringSchema<TType, TContext, TDefault, TFlags>;
    hanAlphaNumberSymbol(): StringSchema<TType, TContext, TDefault, TFlags>;
  }
}

export default yup;
