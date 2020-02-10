using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    class Role:Entity
    {
        public override OperationResult InsertRecord()
        {
            OperationResult opResult = base.InsertRecord();
            if (opResult.Success)
            {
                Entity entityTable = new Entity("Entity");
                entityTable.Attributes.Add(new Attribute("EntityId"));
                entityTable.connStr = this.connStr;
                OperationResult selectEntity = entityTable.selectRecord();
                if (selectEntity.Success)
                {
                    foreach (Entity entT in selectEntity.RetVal)
                    {
                        Entity secPriv = new Entity("SecurityPrivilege");
                        secPriv.Attributes.Add(new Attribute("EntityId", entT.getAttrValueByName("EntityId"), "int"));
                        secPriv.Attributes.Add(new Attribute("RoleId", this.getAttrValueByName("RoleId"), "string"));
                        secPriv.Attributes.Add(new Attribute("Privilege", "0", "int"));
                        secPriv.connStr = this.connStr;

                        secPriv.InsertRecord();
                    }
                }
            }

            return opResult;
        }
    }
}
