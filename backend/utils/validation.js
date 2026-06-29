export const formatMongooseError = (err) => {
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => {
            if (e.name === "CastError") {
                const label = e.path.charAt(0).toUpperCase() + e.path.slice(1);
                const typeLabel = e.kind === "Number" ? "number" : e.kind.toLowerCase();
                return `${label} must be a valid ${typeLabel}.`;
            }
            return e.message;
        });
        return { status: 400, message: messages.join(" ") };
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "value";
        const label = field === "userFullName" ? "name" : field === "email" ? "email" : field;
        return { status: 409, message: `A member with this ${label} already exists.` };
    }
    return { status: 500, message: "An unexpected error occurred. Please try again." };
};

export const parsePositiveInt = (value, fieldName) => {
    const num = Number(value);
    if (value === "" || value === null || value === undefined || Number.isNaN(num)) {
        return { error: `${fieldName} must be a valid number.` };
    }
    if (!Number.isInteger(num)) {
        return { error: `${fieldName} must be a whole number.` };
    }
    if (num < 0) {
        return { error: `${fieldName} cannot be negative.` };
    }
    return { value: num };
};

export const parseMobileNumber = (value) => {
    const trimmed = String(value).trim();
    if (!/^\d{10,15}$/.test(trimmed)) {
        return { error: "Mobile number must be 10–15 digits." };
    }
    return { value: Number(trimmed) };
};
