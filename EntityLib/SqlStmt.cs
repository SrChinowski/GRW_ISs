using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class SqlStmt
    {
        public string sqlStatement { get; set; }
        public bool getLastIdentity { get; set; }
    }
}
