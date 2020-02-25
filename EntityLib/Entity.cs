using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace EntityLib
{
    public enum whereOperator
    {
        Equal = 1,
        NotEqual = 2,
        Greater = 3,
        GreaterEqual = 4,
        Lower = 5,
        LowerEqual = 6,
        IsNull = 7,
        IsNotNull = 8,
        Like = 9
    }

    public enum logicalOperator
    {
        And = 1,
        Or = 2
    }

    public enum JoinType
    {
        Inner = 1,
        Left = 2,
        Right = 3

    }

    public enum sqlListOf
    {
        Campos = 1, Valores = 2,
    }

    public class Entity
    {        
        private const string COMMA = ",";
        private const string AND = "and";

        private List<SqlStmt> SqlStatementList;
        public string connStr { get; set; }
        public string EntityName { get; set; }
        public string EntityAlias { get; set; }
        public int PKId { get; set; }
        public int Action { get; set; }
        public List<GroupWhere> GroupWheres { get; set; }
        public List<Attribute> Attributes { get; set; }
        public List<JoinEntity> ChildEntities { get; set; }
        public bool getLastIdentity { get; set; }

        public Entity()
        {
            initializeEnt();
        }

        public Entity(string _EntityName)
        {
            initializeEnt();
            EntityName = _EntityName;
            EntityAlias = _EntityName;
        }

        public Entity(string _EntityName, string _EntityAlias)
        {
            initializeEnt();
            EntityName = _EntityName;
            EntityAlias = _EntityAlias;
        }


        private void initializeEnt()
        {
            getLastIdentity = false;
            Attributes = new List<Attribute>();
            GroupWheres = new List<GroupWhere>();
            ChildEntities = new List<JoinEntity>();
            SqlStatementList = new List<SqlStmt>();
        }

        public static Entity construct(Entity _incoMsg)
        {
            Entity retVal;
            switch (_incoMsg.EntityName.ToLower())
            {
                case "role":
                    retVal = new Role();
                    retVal.Action = _incoMsg.Action;
                    retVal.Attributes = _incoMsg.Attributes;
                    retVal.ChildEntities = _incoMsg.ChildEntities;
                    retVal.connStr = _incoMsg.connStr;
                    retVal.EntityAlias = _incoMsg.EntityAlias;
                    retVal.EntityName = _incoMsg.EntityName;
                    retVal.getLastIdentity = _incoMsg.getLastIdentity;
                    retVal.GroupWheres = _incoMsg.GroupWheres;
                    retVal.PKId = _incoMsg.PKId;
                    break;
                default:
                    retVal = _incoMsg;
                    break;
            }
            return retVal;
        }

        public virtual OperationResult UpdateRecord()
        {
            OperationResult opResult = new OperationResult();
            opResult.Success = false;

            List<SqlStmt> listUpdates = new List<SqlStmt>();
            listUpdates.Add(this.createUpdateRecord());

            if (this.hasChildEntities())
            {
                foreach (JoinEntity joinEntity in this.ChildEntities)
                {
                    Entity childEntity = joinEntity.ChildEntity;

                    listUpdates.Add(childEntity.createUpdateRecord());
                }
            }
            SqlStatementList = listUpdates;//
            if (SqlStatementList.Count > 0)
            {
                DAC odac = new DAC(this.connStr);

                opResult = odac.insertUpdSQL(SqlStatementList, true);
            }

            return opResult;
        }
        public virtual OperationResult InsertRecord()
        {
            int pkValue = 0;
            OperationResult opResult = new OperationResult();
            opResult.Success = false;


            System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath(@"\Logs\" + this.EntityName + pkValue.ToString()), Environment.NewLine + EntityName + " " + pkValue.ToString(), Encoding.UTF8);

            SqlStatementList.Add(this.createInsertRecord(this.Attributes, this.EntityName, this.getLastIdentity));

            foreach (JoinEntity joinEntity in this.ChildEntities)
            {
                Entity childEntity = joinEntity.ChildEntity;
                SqlStatementList.Add(this.createInsertRecord(childEntity.Attributes, childEntity.EntityName, childEntity.getLastIdentity));
            }

            if (SqlStatementList.Count > 0)
            {
                DAC odac = new DAC(this.connStr);

                opResult = odac.insertUpdSQL(SqlStatementList);
            }

            return opResult;
        }
        public virtual OperationResult selectRecord()
        {
            OperationResult opResult = new OperationResult();
            opResult.Success = false;


            System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath(@"\Logs\" + this.EntityName), Environment.NewLine + EntityName, Encoding.UTF8);

            SqlStatementList.Add(this.createSelectRecord(this));

            if (SqlStatementList.Count > 0)
            {
                DAC odac = new DAC(this.connStr);

                opResult = odac.selectSQL(SqlStatementList[0], this.EntityName);
            }

            return opResult;
        }
        public virtual OperationResult DeleteRecord()
        {
            OperationResult opResult = new OperationResult();
            opResult.Success = false;

            List<SqlStmt> listUpdates = new List<SqlStmt>();
            SqlStmt sqlStmt = this.createDeleteRecord();
            if (sqlStmt.sqlStatement != string.Empty)
            {
                listUpdates.Add(sqlStmt);

                if (this.hasChildEntities())
                {
                    foreach (JoinEntity joinEntity in this.ChildEntities)
                    {
                        Entity childEntity = joinEntity.ChildEntity;
                        sqlStmt = childEntity.createDeleteRecord();
                        if (sqlStmt.sqlStatement != string.Empty)
                        {
                            listUpdates.Add(sqlStmt);
                        }
                    }
                }
                SqlStatementList = listUpdates;
                if (SqlStatementList.Count > 0)
                {
                    if (SqlStatementList.Count > 1)
                    {
                        SqlStatementList.Add(SqlStatementList.First());
                        //remove first line
                        SqlStatementList.RemoveAt(0);

                    }
                    DAC odac = new DAC(this.connStr);

                    opResult = odac.insertUpdSQL(SqlStatementList, true);
                }
            }
            else
            {
                opResult.ErrMessage = "La sentencia enviada no cuenta con parametros de filtrado, no se permite borrar información de la tabla completa";
            }

            return opResult;
        }

        private SqlStmt createInsertRecord(List<Attribute> _listOfAttributes, string _entityName, bool getLastIdentity = false)
        {
            SqlStmt sqlStmt = new SqlStmt();
            string sqlCommText = "insert into [{0}]({1})Values({2})";
            string listOfFields = this.convertListAttrToSqlFieldList(_entityName, _listOfAttributes, sqlListOf.Campos, false);
            string listOfValues = this.convertListAttrToSqlFieldList(_entityName, _listOfAttributes, sqlListOf.Valores, false);

            sqlStmt.sqlStatement = string.Format(sqlCommText, _entityName, listOfFields, listOfValues);
            sqlStmt.getLastIdentity = getLastIdentity;
            return sqlStmt;
        }

        private SqlStmt createInsertRecord(List<Attribute> _listOfAttributes, string _entityName, selectJoinEntity _selJoinEntity)
        {
            SqlStmt sqlStmt = new SqlStmt();
            string sqlCommText = "insert into [{0}]({1})Values({2})";

            if (_listOfAttributes.Contains(_selJoinEntity.childAttr))
            {
                _listOfAttributes.Remove(_selJoinEntity.childAttr);
            }

            string listOfFields = _selJoinEntity.childAttr.AttrName + ",";
            listOfFields += this.convertListAttrToSqlFieldList(_entityName, _listOfAttributes, sqlListOf.Campos, false);
            string listOfValues = this.convertListAttrToSqlFieldList(_entityName, _listOfAttributes, sqlListOf.Valores, false);
            listOfValues = "{0}," + listOfValues;

            sqlStmt.sqlStatement = string.Format(sqlCommText, _entityName, listOfFields, listOfValues);
            sqlStmt.getLastIdentity = getLastIdentity;
            return sqlStmt;
        }

        private SqlStmt createUpdateRecord()
        {
            SqlStmt sqlStmt = new SqlStmt();
            if (this.Attributes.Count > 0)
            {

                string sqlCommText = "Update [{0}] set {1} {2} {3}";
                string where = "Where";
                string listOfAssignFields = this.getSplitList(this.EntityName, this.Attributes, COMMA, false);
                string whereStmt = string.Empty;

                if (this.GroupWheres.Count > 0)
                {
                    whereStmt = this.creatGroupStmt(this.GroupWheres, this.EntityName);
                }

                // sqlStmt.sqlStatement = string.Format(sqlCommText, this.EntityName, listOfAssignFields, whereStmt);
                sqlStmt.sqlStatement = string.Format(sqlCommText, this.EntityName, listOfAssignFields, where, whereStmt);
            }
            return sqlStmt;
        }
        private SqlStmt createDeleteRecord()
        {
            SqlStmt sqlStmt = new SqlStmt();
            if (this.Attributes.Count > 0)
            {

                string sqlCommText = "Delete [{0}] where {1}";
                string whereStmt = string.Empty;

                if (this.GroupWheres.Count > 0)
                {
                    whereStmt = this.creatGroupStmt(this.GroupWheres, this.EntityName);
                    sqlStmt.sqlStatement = string.Format(sqlCommText, this.EntityName, whereStmt);
                }
            }
            return sqlStmt;
        }

        private SqlStmt createSelectRecord(Entity _entity)
        {
            SqlStmt sqlStmt = new SqlStmt();
            string sqlCommText = "Select {0} from [{1}]";
            string listOfAssignFields = "*";
            string joinStmt = string.Empty;
            if (_entity.Attributes.Count > 0)
            {
                listOfAssignFields = this.convertListAttrToSqlFieldList(_entity.EntityAlias, _entity.Attributes, sqlListOf.Campos, true);
                if (_entity.ChildEntities.Count > 0)
                {
                    string listofjoinfields = this.getJoinFields(_entity);
                    if (listofjoinfields.Trim() != string.Empty)
                    {
                        listOfAssignFields = listOfAssignFields + "," + listofjoinfields;
                    }
                }
            }

            string whereStmt = string.Empty;

            if (_entity.GroupWheres.Count > 0)
            {
                string where = "Where";
                whereStmt = this.creatGroupStmt(_entity.GroupWheres, _entity.EntityName);
                //armar where de entidades con join
                whereStmt = whereStmt + this.getWhereJoin(_entity);
                sqlStmt.sqlStatement = string.Format(sqlCommText, listOfAssignFields, _entity.EntityName == "Usuario" ? _entity.EntityName + " WITH (NOLOCK) " : _entity.EntityName);
                //armar join
                joinStmt += this.getJoinStmt(_entity);
                //sqlStmt.sqlStatement = string.Format("{0} {1} {2}", sqlStmt.sqlStatement, joinStmt, whereStmt);
                sqlStmt.sqlStatement = string.Format("{0} {1} {2} {3}", sqlStmt.sqlStatement, joinStmt, where, whereStmt);
            }
            else
            {
                whereStmt = whereStmt + this.getWhereJoin(_entity, false);
                joinStmt += this.getJoinStmt(_entity);
                sqlStmt.sqlStatement = string.Format(sqlCommText, listOfAssignFields, _entity.EntityName);
                if (joinStmt != string.Empty)
                {
                    sqlStmt.sqlStatement = string.Format("{0} {1}", sqlStmt.sqlStatement, joinStmt);
                }
                if (whereStmt != string.Empty)
                {
                    sqlStmt.sqlStatement = string.Format("{0} {1}", sqlStmt.sqlStatement, whereStmt);
                }
            }
            return sqlStmt;
        }


        private string creatGroupStmt(List<GroupWhere> groupWheres, string _entityName)
        {
            int lastVal = 1;
            string groupStmt = string.Empty;
            string valueSQL = "{0} {1}";
            string separator;
            foreach (GroupWhere group in groupWheres)
            {
                // string WhereStmt = this.convertKeysToWhereStmt(_entityName, group.listWhere, group.LogicalOperatorWhere, false);
                string WhereStmt = this.convertKeysToWhereStmt(_entityName, group.listWhere, group.LogicalOperatorWhere, true);
                if (group.LogicalOperatorGroup == logicalOperator.And)
                {
                    separator = " and ";
                }
                else
                {
                    separator = " or ";
                }
                if (lastVal == groupWheres.Count)
                {
                    valueSQL = string.Format("{0}", WhereStmt);
                }
                else
                {
                    valueSQL = string.Format("{0} {1}", WhereStmt, separator);
                }
                groupStmt = string.Format("{0}{1}", groupStmt, valueSQL);
                lastVal++;
            }
            return groupStmt;
        }
        private string convertKeysToWhereStmt(string _entityName, List<Where> _keysAttr, logicalOperator logicalOperator, bool isSelect, bool isJoin = false)
        {
            string where = "({0})";
            string listOfValues = string.Empty;
            listOfValues = this.getSplitList(_entityName, _keysAttr, logicalOperator, isSelect);
            if (isJoin)
            {
                return listOfValues;
            }
            else
            {
                return string.Format(where, listOfValues);
            }
        }





        private string getJoinStmt(Entity _mainEntity)
        {
            bool hasJoin = false;
            string joinStmt = " {2} join [{0}] as {3} on {1} ";
            string sllJoinStmt = string.Empty;
            foreach (JoinEntity joinEntity in _mainEntity.ChildEntities)
            {
                Entity childEntity = joinEntity.ChildEntity;
                bool moreThanOne = false;
                string equalJoinStmt = string.Empty;
                if (joinEntity.selectJoinList != null)
                {
                    foreach (selectJoinEntity selJoinEntity in joinEntity.selectJoinList)
                    {
                        hasJoin = true;
                        if (moreThanOne)
                        {
                            if (selJoinEntity.logicOperator == logicalOperator.And)
                            {
                                equalJoinStmt = string.Format("{0} and ", equalJoinStmt);
                            }
                            else
                            {
                                equalJoinStmt = string.Format("{0} or ", equalJoinStmt);
                            }
                        }
                        Attribute childAttr = selJoinEntity.childAttr;
                        Attribute mainAttr = selJoinEntity.mainAttr;
                        string onStmt = "{0}.{1} = {2}.{3}";
                        equalJoinStmt += string.Format(onStmt, _mainEntity.EntityAlias, mainAttr.AttrName, childEntity.EntityAlias, childAttr.AttrName);
                        moreThanOne = true;
                    }
                }

                if (hasJoin)
                    sllJoinStmt += string.Format(joinStmt, childEntity.EntityName, equalJoinStmt, joinEntity.JoinType.ToString(), childEntity.EntityAlias);
                else
                    sllJoinStmt = string.Empty;

                if (childEntity.ChildEntities.Count > 0)
                {
                    sllJoinStmt += this.getJoinStmt(childEntity);
                }
            }

            return sllJoinStmt;
        }
        private string getJoinFields(Entity _mainEntity)
        {
            string listOfFields = string.Empty;
            foreach (JoinEntity joinEntity in _mainEntity.ChildEntities)
            {
                Entity childEntity = joinEntity.ChildEntity;
                if (childEntity.Attributes != null)
                {
                    if (childEntity.Attributes.Count > 0)
                    {
                        if (listOfFields == string.Empty)
                        {
                            listOfFields += this.convertListAttrToSqlFieldList(childEntity.EntityAlias, childEntity.Attributes, sqlListOf.Campos, true, true);
                        }
                        else
                        {
                            listOfFields += "," + this.convertListAttrToSqlFieldList(childEntity.EntityAlias, childEntity.Attributes, sqlListOf.Campos, true, true);
                        }
                    }
                }
                if (childEntity.ChildEntities.Count > 0)
                {
                    string listChildJoin = this.getJoinFields(childEntity);
                    if (listChildJoin != string.Empty)
                    {
                        listOfFields += "," + listChildJoin;
                    }
                }
            }
            return listOfFields;
        }
        private string getWhereJoin(Entity _mainEntity, bool _parentHasWhere = true)
        {
            bool isFirstWhere = true;
            string whereList = string.Empty;
            bool hasWhere = false;
            foreach (JoinEntity joinEntity in _mainEntity.ChildEntities)
            {
                if (joinEntity.ChildEntity.GroupWheres.Count > 0)
                {
                    hasWhere = true;
                    Entity childEntity = joinEntity.ChildEntity;
                    if (childEntity.GroupWheres.Count > 0)
                    {
                        string whereStmt = this.creatGroupStmt(childEntity.GroupWheres, childEntity.EntityName);

                        if (whereList == string.Empty)
                        {
                            whereList += whereStmt;
                        }
                        if (joinEntity.logicOperator == logicalOperator.And)
                        {
                            whereList += " and " + whereStmt;
                        }
                        else
                        {
                            whereList += " or " + whereStmt;
                        }
                    }

                    if (isFirstWhere)
                    {
                        isFirstWhere = false;
                        if (_parentHasWhere)
                        {
                            if (joinEntity.logicOperator == logicalOperator.And)
                            {
                                whereList = " and " + whereList;
                            }
                            else
                            {
                                whereList = " or " + whereList;
                            }
                        }
                        else
                            whereList = " where " + whereList;
                    }

                    if (childEntity.ChildEntities.Count > 0)
                    {
                        whereList += this.getWhereJoin(childEntity, hasWhere);
                    }
                }
                else
                {
                    Entity childEntity = joinEntity.ChildEntity;
                    if (childEntity.ChildEntities.Count > 0)
                    {
                        whereList += this.getWhereJoin(childEntity, _parentHasWhere);
                    }
                }
            }
            return whereList;
        }
        private string getSplitList(string _entityName, List<Where> _listAttr, logicalOperator logicalOperator, bool isSelect)
        {
            string returnValue = string.Empty;
            string splitStr = " {0} {1} ";
            string assignSqlStr = string.Empty;
            string valueSQL = string.Empty;
            string _separator = string.Empty;
            int lastVal = 1;
            foreach (Where attr in _listAttr)
            {
                if (logicalOperator == logicalOperator.And)
                {
                    _separator = " and ";
                }
                else
                {
                    _separator = " or ";
                }

                assignSqlStr = this.convertToQueryData(_entityName, attr.Attribute, isSelect, attr.WhereOperator);
                if (lastVal == _listAttr.Count)
                {
                    valueSQL = string.Format("{0}", assignSqlStr);
                }
                else
                {
                    valueSQL = string.Format(splitStr, assignSqlStr, _separator);
                }
                returnValue = string.Format("{0}{1}", returnValue, valueSQL);
                lastVal++;
            }
            return returnValue;
        }
        private string getSplitList(string _entityName, List<Attribute> _listAttr, string _separator, bool isSelect)
        {
            string returnValue = string.Empty;
            //0=fiel dName;
            //1=_separator And or comma
            //2=' or blank
            //3=field Value
            //4=' or blank
            string splitStr = "{0} {1}";
            string assignSqlStr = string.Empty;
            string valueSQL = string.Empty;
            int intValue = 0;
            Int64 idValue = 0;
            DateTime dtValue;
            decimal decValue;
            float floatVal;
            string strValue;
            int group = -1;

            foreach (Attribute attr in _listAttr)
            {

                assignSqlStr = this.convertToQueryData(_entityName, attr, isSelect);
                valueSQL = string.Format(splitStr, assignSqlStr, _separator);
                returnValue = string.Format("{0}{1}", returnValue, valueSQL);

            }

            returnValue = returnValue.Substring(0, (returnValue.Length - _separator.Length));
            return returnValue;
        }
        private string convertToQueryData(string _entityName, Attribute _attr, bool isSelect, whereOperator _whereOp = whereOperator.Like)
        {
            string parString = "{0} = {1}";
            string valueSQL = string.Empty;
            if (isSelect)
            {
                if (_whereOp != whereOperator.IsNotNull && _whereOp != whereOperator.IsNull)
                {
                    parString = "[{0}].{1}{3}{2}";
                    valueSQL = string.Format(parString, _entityName, _attr.AttrName, this.sqlValue(_attr.AttrType, _attr.AttrValue.ToString()), convertWhereOp(_whereOp));
                }
                else
                {
                    parString = "[{0}].{1}{2}";
                    valueSQL = string.Format(parString, _entityName, _attr.AttrName, convertWhereOp(_whereOp));
                }
            }
            else
            {
                parString = "{0}={1}";
                valueSQL = string.Format(parString, _attr.AttrName, this.sqlValue(_attr.AttrType, _attr.AttrValue.ToString()));
            }
            return valueSQL;
        }

        private string convertWhereOp(whereOperator _whereOp)
        {
            switch (_whereOp)
            {
                case whereOperator.Equal:
                    return " = ";
                case whereOperator.Greater:
                    return " > ";
                case whereOperator.GreaterEqual:
                    return " >= ";
                case whereOperator.Like:
                    return " like ";
                case whereOperator.Lower:
                    return " < ";
                case whereOperator.LowerEqual:
                    return " <= ";
                case whereOperator.NotEqual:
                    return " <> ";
                case whereOperator.IsNotNull:
                    return " is not null ";
                case whereOperator.IsNull:
                    return " is null ";
            }

            return " like ";
        }
        private string convertListAttrToSqlFieldList(string _entityName, List<Attribute> _listOfAttributes, sqlListOf _sqlListOf, bool isSelect, bool _useAlias = false)
        {
            string listOfFields = string.Empty;
            foreach (Attribute attr in _listOfAttributes)
            {
                if (_sqlListOf == sqlListOf.Campos)
                {
                    if (isSelect)
                    {
                        if (attr.AttrAlias != string.Empty)
                        {
                           
                            listOfFields = string.Format("{0},[{1}].{2} as {3}", listOfFields, _entityName, attr.AttrName, attr.AttrAlias);
                        }
                        else
                        {
                            if (_useAlias)
                            {
                                listOfFields = string.Format("{0},[{1}].{2} as {1}{2}", listOfFields, _entityName, attr.AttrName);
                            }
                            else
                            {
                                listOfFields = string.Format("{0},[{1}].{2}", listOfFields, _entityName, attr.AttrName);
                            }
                        }
                    }
                    else
                    {
                        listOfFields = string.Format("{0},{1}", listOfFields, attr.AttrName);
                    }
                }
                else
                {
                    listOfFields = string.Format("{0},{1}", listOfFields, this.sqlValue(attr.AttrType, attr.AttrValue));
                }
            }
            listOfFields = listOfFields.Substring(1, listOfFields.Length - 1);
            return listOfFields;
        }
        private string sqlValue(string _typeOf, string _attrValue)
        {
            string valueSQL = string.Empty;
            switch (_typeOf)
            {
                case "string":
                    //if (_attrValue == "null")
                    //{
                    //    valueSQL = string.Format("{0}", _attrValue);
                    //}
                    //else {
                    valueSQL = string.Format("'{0}'", _attrValue);
                    //}


                    break;
                case "datetime":
                    valueSQL = "1900-01-01";
                    if (_attrValue.Trim() != "")
                    {
                        valueSQL = string.Format("'{0}'", string.Format("{0}-{1}-{2}", _attrValue.Substring(6, 4), _attrValue.Substring(3, 2), _attrValue.Substring(0, 2)));
                    }
                    break;
                case "int":
                case "int64":
                case "long":
                case "decimal":
                case "float":
                    string sqlVal = "0";
                    if (_attrValue != string.Empty)
                    {
                        sqlVal = _attrValue;
                    }
                    else
                    {
                        if (_typeOf == "int" && _attrValue == "null")
                        {
                            sqlVal = "null";
                        }
                    }
                    valueSQL = string.Format("{0}", sqlVal);
                    break;
                case "attribute":
                    sqlVal = _attrValue;
                    valueSQL = string.Format("{0}", sqlVal);
                    break;
            }
            return valueSQL;
        }
        public string getAttrValueByName(string _attrName)
        {
            Attribute attr = this.Attributes.Find(x => x.AttrName.ToLower() == _attrName.ToLower());
            if (attr != null)
            {
                return attr.AttrValue;
            }
            else
            {
                return string.Empty;
            }
        }
        public string getKeyValueByName(string _attrName)
        {
            foreach (GroupWhere grpW in this.GroupWheres)
            {
                Where attr = grpW.listWhere.Find(x => x.Attribute.AttrName.ToLower() == _attrName.ToLower());
                if (attr != null)
                {
                    return attr.Attribute.AttrValue;
                }
                else
                {
                    return string.Empty;
                }
            }

            return string.Empty;
        }
        public bool hasChildEntities()
        {
            return this.ChildEntities.Count > 0;
        }
    }
}
