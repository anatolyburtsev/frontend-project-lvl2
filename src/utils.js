import path from "path";

export const normalizePath = (filepath) => {
    if (!path.isAbsolute(filepath)) {
        filepath = path.join(process.cwd(), filepath);
    }
    return path.normalize(filepath);
};
