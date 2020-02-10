using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class Where
    {
        public whereOperator WhereOperator { get; set; }
        public Attribute Attribute { get; set; }

        public Where()
        {
        }
        public Where(string _AttrName)
        {
            Attribute = new Attribute(_AttrName);
            WhereOperator = whereOperator.Equal;
        }
        public Where(string _AttrName, string _AttrValue)
        {
            Attribute = new Attribute(_AttrName, _AttrValue);
            WhereOperator = whereOperator.Equal; 
        }

        public Where(string _AttrName, string _AttrValue, string _AttrType)
        {
            Attribute = new Attribute(_AttrName, _AttrValue, _AttrType);
            WhereOperator = whereOperator.Equal;
        }

        public Where(string _AttrName, string _AttrValue, string _AttrType, whereOperator _WhereOperator)
        {
            Attribute = new Attribute(_AttrName, _AttrValue, _AttrType);
            WhereOperator = whereOperator.Equal;
            WhereOperator = _WhereOperator;
        }
    }
}
