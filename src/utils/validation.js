const validateFile = async (
    responseObj,
    file,
    fieldName,
    allowedExtension,
    maxSizeInMb
) => {
    let errorMessage = '';
    let isValidFile = true;
    responseObj.statusCode = 400;

    if (!file) {
        isValidFile = false;
        errorMessage = `The ${fieldName} field is required.`
    } else if (file.fieldname !== fieldName) {
        isValidFile = false;
        errorMessage = `The ${fieldName} field is required.`
    } else {
        // Validate extension
        if (allowedExtension.length > 0) {
            const extension = path.extname(file.originalname).toLowerCase();
            const isValidExt = await isValidExtenstion(extension, allowedExtension);

            if (!isValidExt) {
                isValidFile = false;
                errorMessage = `The type of ${fieldName} must be ${allowedExtension.join('/')}.`
            }
        }

        // Validate file size
        if (maxSizeInMb) {
            const isValidSize = await isValidFileSize(
                file.size,
                maxSizeInMb * 1024 * 1024
            );

            if (!isValidSize) {
                isValidFile = false;
                errorMessage = `The ${fieldName} may not be greater than ${maxSizeInMb.toString()} MB.`
            }
        }
    }

    if (!isValidFile) {
        throw new Error(errorMessage);
    }
};

const isValidExtenstion = async (mimetype, allowedExtension) => {
    if (allowedExtension.includes(mimetype)) {
        return true;
    } else {
        return false;
    }
};

const isValidFileSize = async (fileSize, maxSize) => {
    if (fileSize <= maxSize) {
        return true;
    } else {
        return false;
    }
};

module.exports = { validateFile }