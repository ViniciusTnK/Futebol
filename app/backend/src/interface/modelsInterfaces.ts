interface UserInterface {
  id: number;
  role: string;
  email: string;
  password: string;
  username: string;
}

interface TeamInterface {
  id: number;
  teamName: string;
}

interface MatchInterface {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export { UserInterface, TeamInterface, MatchInterface };
