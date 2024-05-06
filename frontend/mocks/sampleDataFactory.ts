export const createSampleData = (overrides = {}) => {
  const id = Math.floor(Math.random() * 10000);
  return {
    id: id,
    title: "title" + id,
    price: Math.floor(Math.random() * 10000),
    description: "description" + id,
    ...overrides,
  };
};
