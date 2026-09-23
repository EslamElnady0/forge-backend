type ValidationError = {
  field: string;
  message: string;
};

export class Validator {
  private errors: ValidationError[] = [];
  private value: any;
  private fieldName: string | null = null;

  constructor() {}

  for(fieldName: string, value: any): Validator {
    this.fieldName = fieldName;
    this.value = value;
    return this;
  }

  required(): Validator {
    if (this.fieldName == null) return this;
    const val: string | undefined = this.value as string | undefined;
    if (val == null || val.toString().trim() === "") {
      this.errors.push({
        field: this.fieldName,
        message: `${this.fieldName} field is required`,
      });
    }
    return this;
  }

  isEmail(): Validator {
    if (this.fieldName == null) return this;
    const val: string | undefined = this.value as string | undefined;
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (val != null && val.toString().trim() !== "" && !pattern.test(val)) {
      this.errors.push({
        field: this.fieldName,
        message: `invalid email format`,
      });
    }
    return this;
  }

  optional(): Validator {
    // marker for fluent API; handled implicitly by checks
    return this;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  // Convenience static helper to validate multiple fields with chained calls
  static validate(build: (v: Validator) => void): ValidationError[] {
    const v: Validator = new Validator();
    build(v);
    return v.getErrors();
  }
}
