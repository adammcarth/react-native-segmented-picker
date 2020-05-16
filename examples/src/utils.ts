export const generateOptions = (numOptions: number, startNum: number = 1): Array<{
  label: string;
}> => {
  const options = [];
  for (let i = (startNum - 1); i < ((startNum - 1) + numOptions); i += 1) {
    options.push({
      label: `Option ${i + 1}`,
    });
  }
  return options;
};

export default {
  generateOptions,
};
