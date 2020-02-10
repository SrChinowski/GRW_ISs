using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class JoinEntity
    {
        //List<GroupWhere> listGroup { get; set; }
        public logicalOperator logicOperator { get; set; }
        public Entity ChildEntity { get; set; }
        public JoinType JoinType { get; set; }
        public List<selectJoinEntity> selectJoinList { get; set; }

        public JoinEntity()
        {
            this.selectJoinList = new List<selectJoinEntity>();
            this.JoinType = JoinType.Inner;
        }
    }

    public class selectJoinEntity
    {
        public logicalOperator logicOperator { get; set; }
        public Attribute mainAttr { get; set; }
        public Attribute childAttr { get; set; }

        public selectJoinEntity(string _mainAttr, logicalOperator _logicalOperator, string _childAttr)
        {
            this.logicOperator = _logicalOperator;
            this.mainAttr = new Attribute(_mainAttr);
            this.childAttr = new Attribute(_childAttr);
        }

        public selectJoinEntity()
        {
        }

    }
}
