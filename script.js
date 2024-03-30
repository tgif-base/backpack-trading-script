// Configuration variables
const tradeVolume = 0;
const stopUsdc = 10;
const stopTradeAmount = 100;

// Timer and counter
let timer;
let counter = 1;

// Automatic trading function
const tradeMarket = async () => {
  const isLastest = await checkVolume(); // Check stop conditions
  if (isLastest) {
    console.log('Trading stopped');
    clearInterval(timer);
    return;
  }

  // Buying logic
  await clickTab('Buy');
  await clickMax();
  await clickActionButton('.bg-greenPrimaryButtonBackground');

  // Switch to selling logic
  await clickTab('Sell');
  await clickMax();
  await clickActionButton('.bg-redPrimaryButtonBackground');

  counter++; // Increase trade count
};

// Function to click tabs
const clickTab = async (tabName) => {
  const tabs = document.querySelectorAll('.text-center.text-sm.font-semibold');
  const tab = Array.from(tabs).find(el => el.textContent === tabName);
  if (tab) tab.click();
  await new Promise(resolve => setTimeout(resolve, 100));
};

// Function to click Max button
const clickMax = async () => {
  const buttons = document.querySelectorAll('.flex.items-center.justify-center.flex-row.cursor-pointer.rounded-full.bg-baseBackgroundL1');
  const maxButton = Array.from(buttons).find(button => button.textContent.trim() === 'Max');
  if (maxButton) {
    maxButton.click();
    await new Promise(resolve => setTimeout(resolve, 100));
  } else {
    console.error('Max button not found');
  }
};

// Function to click action buttons (Buy/Sell)
const clickActionButton = async (selector) => {
  const actionButton = document.querySelector(selector);
  if (actionButton && !actionButton.disabled) {
    actionButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Function to check stop conditions
const checkVolume = async () => {
  let isLastest = false;
  const balanceText = document.querySelector('.font-medium.text-xs.text-baseTextHighEmphasis').textContent;
  const balance = parseFloat(balanceText);

  if (tradeVolume === 1 && balance < stopUsdc) {
    console.log(`Balance dropped below ${stopUsdc} USDC, stopping trade`);
    isLastest = true;
  } else if (tradeVolume === 2 && counter >= stopTradeAmount) {
    console.log(`Trade count reached ${stopTradeAmount}, stopping trade`);
    isLastest = true;
  }

  return isLastest;
};

// Set an interval for automatic trading
timer = setInterval(tradeMarket, 3000);
