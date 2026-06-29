export const getApiErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
    if (!err?.response) {
        return err?.message === "Network Error"
            ? "Unable to connect to the server. Please check your connection."
            : fallback;
    }
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.errors) {
        const msgs = Object.values(data.errors).map((e) => e.message || String(e));
        return msgs.join(". ");
    }
    return fallback;
};

export const parsePositiveInteger = (value, fieldName) => {
    const num = Number(value);
    if (value === "" || value === null || value === undefined || Number.isNaN(num)) {
        return { valid: false, error: `${fieldName} must be a valid number.` };
    }
    if (!Number.isInteger(num)) {
        return { valid: false, error: `${fieldName} must be a whole number.` };
    }
    if (num < 0) {
        return { valid: false, error: `${fieldName} cannot be negative.` };
    }
    return { valid: true, value: num };
};

export const parseAge = (value) => {
    const result = parsePositiveInteger(value, "Age");
    if (!result.valid) return result;
    if (result.value < 1 || result.value > 150) {
        return { valid: false, error: "Age must be between 1 and 150." };
    }
    return result;
};

export const parseMobileNumber = (value) => {
    const trimmed = String(value).trim();
    if (!/^\d{10,15}$/.test(trimmed)) {
        return { valid: false, error: "Mobile number must be 10–15 digits." };
    }
    return { valid: true, value: Number(trimmed) };
};

export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { valid: false, error: "Password must be at least 6 characters." };
    }
    return { valid: true, value: password };
};

export const isNonEmpty = (value) => value !== null && value !== undefined && String(value).trim() !== "";
