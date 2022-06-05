interface UserInterface {
  id: number;
  role: string;
  email: string;
  password: string;
  username: string;
}

interface TeamInterface {
  teamName: string;
}

interface MatchInterface {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export { UserInterface, TeamInterface, MatchInterface };
