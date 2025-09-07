import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/snakeGamePage';

test.describe('Snake Game', () => {
  let snakeGamePage: SnakeGamePage;

  test.beforeEach(async ({ page }) => {
    snakeGamePage = new SnakeGamePage(page);
    await snakeGamePage.goto();
    // Wait for the snakeGame object and its essential properties to be available and populated
    await page.waitForFunction(() => {
      const sg = (window as any).snakeGame;
      return sg && sg.snake && sg.snake.length > 0 && sg.food && sg.direction;
    });
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Snake Game');
  });

  test('should start the game when the Start Game button is clicked', async () => {
    await snakeGamePage.clickStartGameButton();
    await expect(snakeGamePage.startGameButton).toBeDisabled();
    await expect(snakeGamePage.pauseButton).toBeEnabled();
  });

  test('should pause and resume the game', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.clickPauseButton();
    await expect(snakeGamePage.pauseButton).toHaveText('Resume');
    // Assert game is paused (e.g., snake position doesn't change for a short period)
    const initialSnakePosition = await snakeGamePage.getSnakeHeadPosition();
    await page.waitForTimeout(500); // Wait for half a second
    const newSnakePosition = await snakeGamePage.getSnakeHeadPosition();
    expect(newSnakePosition).toEqual(initialSnakePosition);

    await snakeGamePage.clickPauseButton(); // Click to resume
    await expect(snakeGamePage.pauseButton).toHaveText('Pause');
    // Assert game resumes (e.g., snake position changes)
    await page.waitForTimeout(500);
    const resumedSnakePosition = await snakeGamePage.getSnakeHeadPosition();
    expect(resumedSnakePosition).not.toEqual(initialSnakePosition);
  });

  test('should move the snake up when the up arrow key is pressed', async () => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.pressKey('ArrowUp');
    await snakeGamePage.page.waitForTimeout(100); // Give game time to process
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Assert game is still running
  });

  test('should move the snake down when the down arrow key is pressed', async () => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.pressKey('ArrowDown');
    await snakeGamePage.page.waitForTimeout(100); // Give game time to process
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Assert game is still running
  });

  test('should move the snake left when the left arrow key is pressed', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.pressKey('ArrowLeft');
    await snakeGamePage.page.waitForTimeout(100); // Give game time to process
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Assert game is still running
  });

  test('should move the snake right when the right arrow key is pressed', async () => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.pressKey('ArrowRight');
    await snakeGamePage.page.waitForTimeout(100); // Give game time to process
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Assert game is still running
  });

  test('should increase the score when the snake eats food', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    const initialScore = await snakeGamePage.getScore();
    const finalScore = await snakeGamePage.eatFoodAndGetScore(initialScore);
    expect(parseInt(finalScore || '0')).toBeGreaterThan(parseInt(initialScore || '0'));
  });

  test('should reach a score of 100 by eating food', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    let currentScore = 0;
    const targetScore = 100;

    while (currentScore < targetScore) {
      const initialScore = await snakeGamePage.getScore();
      await snakeGamePage.eatFoodAndGetScore(initialScore);
      currentScore = parseInt(await snakeGamePage.getScore() || '0');
      // Add a small timeout to allow game state to settle, if necessary
      await page.waitForTimeout(50);
    }
    expect(currentScore).toBe(targetScore);
  });

  test('should end the game when the snake hits a wall', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    await snakeGamePage.pressKey('ArrowLeft'); // Set direction towards a wall
    await snakeGamePage.waitForGameOver();
    await expect(snakeGamePage.gameOverMessage).toBeVisible();
    await page.waitForTimeout(1000); // Added for visual confirmation
  });

  test('should prevent 180-degree turns', async () => {
    await snakeGamePage.clickStartGameButton();

    // Test horizontal 180-degree turn prevention
    await snakeGamePage.pressKey('ArrowRight'); // Move right
    await snakeGamePage.page.waitForTimeout(100);
    let initialDirection = await snakeGamePage.getSnakeDirection();
    await snakeGamePage.pressKey('ArrowLeft'); // Try to turn 180 degrees
    await snakeGamePage.page.waitForTimeout(100);
    let newDirection = await snakeGamePage.getSnakeDirection();
    expect(newDirection).toEqual(initialDirection); // Direction should not have changed
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Game should not be over

    // Test vertical 180-degree turn prevention
    await snakeGamePage.pressKey('ArrowDown'); // Move down
    await snakeGamePage.page.waitForTimeout(100);
    initialDirection = await snakeGamePage.getSnakeDirection();
    await snakeGamePage.pressKey('ArrowUp'); // Try to turn 180 degrees
    await snakeGamePage.page.waitForTimeout(100);
    newDirection = await snakeGamePage.getSnakeDirection();
    expect(newDirection).toEqual(initialDirection); // Direction should not have changed
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Game should not be over
  });

  test('should restart the game after game over', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();
    // Trigger game over (e.g., hit a wall)
    await snakeGamePage.pressKey('ArrowLeft'); // Set direction towards a wall
    await snakeGamePage.waitForGameOver();

    await snakeGamePage.clickPlayAgainButton();
    await expect(snakeGamePage.gameOverMessage).not.toBeVisible(); // Game over message should disappear
    await expect(snakeGamePage.startGameButton).toBeDisabled(); // Start button should be disabled again
    await expect(snakeGamePage.scoreDisplay).toHaveText('0'); // Score should reset

    // --- New steps: Eat food and then hit the wall again ---

    // Eat food after restart
    const initialScoreAfterRestart = await snakeGamePage.getScore();
    const finalScoreAfterFood = await snakeGamePage.eatFoodAndGetScore(initialScoreAfterRestart);
    expect(parseInt(finalScoreAfterFood || '0')).toBeGreaterThan(parseInt(initialScoreAfterRestart || '0'));

    // Hit the wall again after eating food
    await snakeGamePage.pressKey('ArrowLeft'); // Set direction towards a wall
    await snakeGamePage.waitForGameOver();
    await expect(snakeGamePage.gameOverMessage).toBeVisible();
    await page.waitForTimeout(1000); // Added for visual confirmation
  });

  test('clicking reset button should reset the position of the food', async ({ page }) => {
    await snakeGamePage.clickStartGameButton(); // Start the game

    // Get initial food position
    const initialFoodPosition = await snakeGamePage.getFoodPosition();

    // Make the snake eat food to change its position
    const initialScore = await snakeGamePage.getScore();
    await snakeGamePage.eatFoodAndGetScore(initialScore);

    // Click the reset button
    await snakeGamePage.clickResetButton();

    // Get the new food position after reset
    const newFoodPosition = await snakeGamePage.getFoodPosition();

    // Assert that the new food position is different from the initial one
    expect(newFoodPosition).not.toEqual(initialFoodPosition);

    // --- New steps: After reset, eat food once then hit the wall ---

    // Start the game again after reset (reset button doesn't start the game)
    await snakeGamePage.clickStartGameButton();

    // Eat food once
    const scoreAfterReset = await snakeGamePage.getScore();
    await snakeGamePage.eatFoodAndGetScore(scoreAfterReset);
    expect(parseInt(await snakeGamePage.getScore() || '0')).toBeGreaterThan(parseInt(scoreAfterReset || '0'));

    // Hit the wall
    await snakeGamePage.pressKey('ArrowLeft'); // Set direction towards a wall
    await snakeGamePage.waitForGameOver();
    await expect(snakeGamePage.gameOverMessage).toBeVisible();
    await page.waitForTimeout(1000); // Added for visual confirmation
  });

  test('clicking reset button should reset game state without starting game', async ({ page }) => {
    await snakeGamePage.clickStartGameButton(); // Start the game
    await snakeGamePage.pressKey('ArrowRight'); // Move a bit
    await snakeGamePage.page.waitForTimeout(500);
    await snakeGamePage.eatFoodAndGetScore(await snakeGamePage.getScore()); // Eat some food

    await snakeGamePage.clickResetButton(); // Click the reset button

    await expect(snakeGamePage.scoreDisplay).toHaveText('0'); // Score should be 0
    await expect(snakeGamePage.startGameButton).toBeEnabled(); // Start button should be enabled
    await expect(snakeGamePage.pauseButton).toBeDisabled(); // Pause button should be disabled

    // Verify snake is at initial position (approximate center)
    const snakeHead = await snakeGamePage.getSnakeHeadPosition();
    const tileCount = await page.evaluate(() => (window as any).snakeGame.tileCount);
    const expectedCenterX = Math.floor(tileCount / 2);
    const expectedCenterY = Math.floor(tileCount / 2);
    expect(snakeHead.x).toBe(expectedCenterX);
    expect(snakeHead.y).toBe(expectedCenterY);

    // Verify food is present (and different from before reset, though not explicitly tested here)
    const foodPosition = await snakeGamePage.getFoodPosition();
    expect(foodPosition).toBeDefined();
  });

  test('should end the game when the snake hits itself', async ({ page }) => {
    await snakeGamePage.clickStartGameButton();

    // Make the snake long enough to hit itself by eating a few foods
    await snakeGamePage.growSnakeByEatingFood(3);

    // Now, try to make the snake hit itself
    // Example: move right, then down, then left, then up to form a loop
    await snakeGamePage.pressKey('ArrowRight');
    await snakeGamePage.page.waitForTimeout(100);
    await snakeGamePage.pressKey('ArrowDown');
    await snakeGamePage.page.waitForTimeout(100);
    await snakeGamePage.pressKey('ArrowLeft');
    await snakeGamePage.page.waitForTimeout(100);
    await snakeGamePage.pressKey('ArrowUp');
    await snakeGamePage.page.waitForTimeout(100);

    await expect(snakeGamePage.gameOverMessage).toBeVisible();
    await page.waitForTimeout(1000); // Added for visual confirmation
  });
});