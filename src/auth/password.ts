import bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
};