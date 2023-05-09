class Player:
    def __init__(self, name, order):
        self.playerName = name
        self.playerScore = 0
        self.playerCards = []
        self.playerBox = [[0] * 10 for _ in " " * 10]
        self.playerBox[0][0] = self.playerBox[0][-1] = self.playerBox[-1][0] = self.playerBox[-1][-1] = 1
        self.playerOrder = order

    def addCard(self, card):
        self.playerCards += (card,)

    def hasWildCard(self):
        return "JC" in self.playerCards or "JD" in self.playerCards

    def getWildCard(self):
        return "JC" if "JC" in self.playerCards else "JD"

    def hasRemove(self):
        return "JH" in self.playerCards or "JS" in self.playerCards

    def getRemove(self):
        return "JH" if "JH" in self.playerCards else "JS"

    def hasChosenValid(self, x, y, opponentBoxes, card):
        print("checking validity...")
        if self.playerBox[x][y]:
            print("ALREADY THERE")
            return False

        for opponentBox in opponentBoxes:
            if opponentBox[x][y]:
                if self.hasRemove():
                    print("REM: ", self.getRemove())
                    self.playerCards.remove(self.getRemove())
                    return 2

                print("OPPO THERE")
                return False

        if card in self.playerCards:
            self.playerCards.remove(card)
            return 1
        elif self.hasWildCard():
            self.playerCards.remove(self.getWildCard())
            return 1

        print("HEHEH")
        return False
