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
  "Address",
  "Add",
  "Ability",
  "Big",
  "Believe",
  "Behind",
  "Behavior",
  "Camera",
  "Choice",
  "Create",
  "Drug",
  "Feel",
  "Grow",
  "Health",
  "Might",
  "Mr",
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
