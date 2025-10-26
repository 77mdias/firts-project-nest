import { IsNotEmpty } from "class-validator";

export class CreateTeamMemberBody {
  @IsNotEmpty({
    message: "Name is required, length must be at least 2 characters",
  })
  name: string;

  @IsNotEmpty({
    message: "Function is required, length must be at least 2 characters",
  })
  function: string;
}
