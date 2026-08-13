import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { type Role, type Permission } from "@/lib/api/roles-permissions";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type EditRoleProps = {
  onOpenChange: (open: boolean) => void;
  role: Role;
  setSelectedRole: Dispatch<SetStateAction<Role | null>>;
};

const EditRole = ({ onOpenChange, role, setSelectedRole }: EditRoleProps) => {
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    onOpenChange(true);
  };

  return (
    <DropdownMenuItem onClick={() => handleEditRole(role)}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit role
    </DropdownMenuItem>
  );
};

export default EditRole;
