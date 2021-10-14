const reader = require("readline-sync");
(async () => {
  const initGrid = () => {
    const grid = [];
    for (let i = 0; i < 6; i++) {
      grid.push(Array(7).fill("."));
    }
    return grid;
  };

  const gridDrop = async (grid, playerSymbol, pos) => {
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
        grid[rowCounter - 1][pos] = playerSymbol;
        continue;
      }

      grid[rowCounter][pos] = playerSymbol;
      rowCounter++;
    }
    return grid;
  };

  const playerDrop = async (grid, playerNo, pos) => {
    return playerNo === 1
      ? await gridDrop(grid, "Red", pos)
      : await gridDrop(grid, "Blue", pos);
  };

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

  const checkForWinnerByColumn = async (grid, playerNo) => {
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
          if (playerNo === 1) {
            console.log(check);
            console.log("Current Cell: " + row[columnCounter]);
            console.log(
              "Cell Above: " +
                grid[rowCounter - 1][columnCounter]
            );
          }

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

  const checkForWinner = async (grid, playerNo) => {
    const isWinnerByRow = await checkForWinnerByRow(grid);
    if (isWinnerByRow) {
      hasWon(playerNo);
      return true;
    }

    const isWinnerByColumn = await checkForWinnerByColumn(grid, playerNo);
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

  const hasWon = async (playerNo) => {
    console.log(`Winner Player #${playerNo}!`);
    console.log(grid);
  };

  const takeTurn = async (grid) => {
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
  takeTurn(grid);

  //   let turns = Array(42).fill(1);
  //   let turnNo = 0;
  //   let posNo = 0;
  //   let playerNo = 1;
  //   turnsLoop: for (const turn of turns) {
  //     grid = await playerDrop(grid, playerNo, posNo);
  //     const isWinner = await checkForWinner(grid, playerNo);
  //     if (isWinner) {
  //       console.log(`${isWinner} is the winner!`);
  //       break turnsLoop;
  //     }
  //     playerNo = playerNo == 1 ? 2 : 1;
  //     posNo = posNo != 6 ? posNo + 1 : 0;
  //     turnNo++;
  //   }
})();
