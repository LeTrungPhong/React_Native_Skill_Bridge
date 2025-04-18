import { RouteProp } from "@react-navigation/native";
import { Team } from "../components/teams/TeamItem";

export type TeamsStackParamList = {
    TeamsList: undefined;
    GeneralScreen: { team: Team };
};

export type GeneralScreenRouteProp = RouteProp<{
    GeneralScreen: { team: Team };
}, 'GeneralScreen'>;
