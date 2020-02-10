using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class Attribute
    {
        public string AttrName { get; set; }
        public string AttrValue { get; set; }
        public string AttrType { get; set; }
        public string AttrAlias { get; set; }

        public Attribute()
        {
            AttrName = string.Empty;
            AttrValue = string.Empty;
            AttrType = string.Empty;
            AttrAlias = string.Empty;
        }

        public Attribute(string _AttrName)
        {
            AttrName = _AttrName;
            AttrValue = string.Empty;
            AttrType = string.Empty;
            AttrAlias = string.Empty;
        }
        public Attribute(string _AttrName, string _AttrValue)
        {
            AttrName = _AttrName;
            AttrValue = _AttrValue;
            AttrType = string.Empty;
            AttrAlias = string.Empty;
        }

        public Attribute(string _AttrName, string _AttrValue, string _AttrType)
        {
            AttrName = _AttrName;
            AttrValue = _AttrValue;
            AttrType = _AttrType;
            AttrAlias = string.Empty;
        }

        public Attribute(string _AttrName, string _AttrValue, string _AttrType, string _AttrAlias)
        {
            AttrName = _AttrName;
            AttrValue = _AttrValue;
            AttrType = _AttrType;
            AttrAlias = _AttrAlias;
        }
    }
}
