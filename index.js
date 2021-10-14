const reader = require("readline-sync");
(async () => {

  /**
   * Initialises the grid
   * @returns 
   */
  const initGrid = () => {
    const grid = [];
    for (let i = 0; i < 6; i++) {
      grid.push(Array(7).fill("."));
    }
    return grid;
  };

  /**
   * Completes a players drop into the grid
   * @param {Array} grid 
   * @param {String} player 
   * @param {Integer} pos 
   * @returns 
   */
  const gridDrop = async (grid, player, pos) => {
    let rowCounter = 0;
    for await (const row of grid) {
      if ((row[pos] === "Red" || row[pos] === "Blue") && rowCounter === 0) {
        //No move
        continue;
      }

      if (row[pos] === "." && rowCounter != grid.length - 1) {
        rowCounter++;
        continue;
      }

      if ((row[pos] === "Red" || row[pos] === "Blue") && rowCounter != 0) {
        grid[rowCounter - 1][pos] = player;
        continue;
      }

      grid[rowCounter][pos] = player;
      rowCounter++;
    }
    return grid;
  };

  /**
   * Completes a players turn
   * @param {Array} grid 
   * @param {Integer} playerNo 
   * @param {Integer} pos 
   * @returns 
   */
  const playerDrop = async (grid, playerNo, pos) => {
    return playerNo === 1
      ? await gridDrop(grid, "Red", pos)
      : await gridDrop(grid, "Blue", pos);
  };

   /**
   * Checks for winner by row
   * @param {Array} grid 
   * @returns 
   */
  const checkForWinnerByRow = async (grid) => {
    for (let i = 0; i < grid.length; i++) {
      const check = [];
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        if (check.length === 0 && row[j] != ".") {
          check.push(row[j]);
        }

        if (check.length) {
          if (row[j] == row[j - 1] && row[j] != ".") {
            check.push(row[j]);
          } else {
            check.length = 0;
          }
        }

        if (check.length === 4) {
          //Winner
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Checks for winner by column
   * @param {Array} grid 
   * @returns 
   */
  const checkForWinnerByColumn = async (grid) => {
    let columns = Array(7).fill(0);
    let columnCounter = 0;
    for await (const column of columns) {
      let rowCounter = 0;
      const check = [];
      for await (const row of grid) {
        if (!check.length && row[columnCounter] != ".") {
          check.push(row[columnCounter]);
        }

        if (check.length) {
          if (
            row[columnCounter] == grid[rowCounter - 1][columnCounter] &&
            row[columnCounter] != "."
          ) {
            check.push(row[columnCounter]);
          } else {
            check.length = 0;
          }
        }

        if (check.length === 4) {
          //Winner
          return true;
        }
        rowCounter++;
      }
      columnCounter++;
    }
    return false;
  };

  /**
   * Check for a winner
   * @param {Array} grid 
   * @param {Integer} playerNo 
   * @returns 
   */
  const checkForWinner = async (grid, playerNo) => {
    const isWinnerByRow = await checkForWinnerByRow(grid);
    if (isWinnerByRow) {
      hasWon(playerNo);
      return true;
    }

    const isWinnerByColumn = await checkForWinnerByColumn(grid);
    if (isWinnerByColumn) {
      hasWon(playerNo);
      return true;
    }

    // const isWinnerByDiagonal = checkForWinnerByDiagonal(grid);
    // if (isWinnerByDiagonal) {
    //   return hasWon(playerNo);
    // }
    
    return false;
  };

  /**
   * Displays message if game has a winner
   * @param {Integer} playerNo 
   */
  const hasWon = async (playerNo) => {
    console.log(`Winner Player #${playerNo}!`);
    console.log(grid);
  };

  /**
   * Starts the turns in the CLI
   * @param {Array} grid 
   */
  const startTurns = async (grid) => {
    let playerNo = 1;
    turnLoop: for (let i = 0; i < 42; i++) {
      const pos = reader.question(
        `Turn #${i + 1}. Please select a slot, 1 - 7 (P${playerNo}): `
      );
      if (pos <= 0 || pos > 7) {
        console.log("Incorrect position, please select 1 - 7.");
        i--;
        continue;
      }
      grid = await playerDrop(grid, playerNo, pos - 1);
      const isWinner = await checkForWinner(grid, playerNo);
      if (isWinner) {
        break turnLoop;
      }
      playerNo = playerNo == 1 ? 2 : 1;
    }
  };

  let grid = initGrid();
  startTurns(grid);
})();
