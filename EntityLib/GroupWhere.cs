using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class GroupWhere
    {
        public logicalOperator LogicalOperatorWhere { get; set; }
        public List<Where> listWhere { get; set; }
        public logicalOperator LogicalOperatorGroup { get; set; }
    }
}
