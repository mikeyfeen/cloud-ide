const words = [
  "Top",
  "Far",
  "Hat",
  "Red",
  "Blue",
  "Purple",
  "Green",
  "Derrick",
  "Words",
  "Bananas",
  "Door",
  "Records",
  "Guitar",
  "Speaker",
  "Flowers",
  "Outlet",
  "White",
  "Laptop",
];

const generateName = (size: number) => {
  let ans = "";
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    ans = ans + words[randomIndex];
  }
  return ans;
};

export { generateName };
