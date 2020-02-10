using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    class DAC
    {
        SqlConnection sqlConn;
        public DAC(string _strConn)
        {
            sqlConn = new SqlConnection(_strConn);
        }

        public OperationResult insertUpdSQL(List<SqlStmt> _listSqlStmt, bool isUpdate=false)
        {
            OperationResult opRes = new OperationResult();
            opRes.Success = false;
            try
            {
                if (sqlConn.State != System.Data.ConnectionState.Open)
                {
                    sqlConn.Open();
                }

                SqlTransaction sqlTransaction = sqlConn.BeginTransaction();
                try
                {
                    if (sqlConn.State != System.Data.ConnectionState.Open)
                    {
                        sqlConn.Open();
                    }
                  //  sqlConn.BeginTransaction();// marca error

                    foreach (SqlStmt sqlStmt in _listSqlStmt)
                    {
                        SqlCommand sqlComm = new SqlCommand(sqlStmt.sqlStatement, sqlConn);
                        sqlComm.Transaction = sqlTransaction;//SE AGREGA
                        sqlComm.ExecuteNonQuery();
                        if (sqlStmt.getLastIdentity && !isUpdate)
                        {
                            sqlComm = new SqlCommand("SELECT @@IDENTITY");
                            var id = sqlComm.ExecuteScalar();

                            opRes.returnedId = int.Parse(id.ToString());
                        }
                    }
                    sqlTransaction.Commit();
                    opRes.Success = true;
                }
                catch (Exception exc)
                {
                    opRes.ErrMessage = exc.Message;
                    if (exc.InnerException != null)
                    {
                        opRes.ErrMessage = exc.InnerException.Message;
                    }
                    sqlTransaction.Rollback();
                }
            }
            catch (Exception exc)
            {
                opRes.ErrMessage = exc.Message;
                if (exc.InnerException != null)
                {
                    opRes.ErrMessage = exc.InnerException.Message;
                }
            }

            return opRes;
        }

        public OperationResult selectSQL(SqlStmt _SqlStmt, string _entityName)
        {
            OperationResult opRes = new OperationResult();
            opRes.Success = false;
            try
            {
                if (sqlConn.State != System.Data.ConnectionState.Open)
                {
                    sqlConn.Open();
                }

                SqlTransaction sqlTransaction = sqlConn.BeginTransaction();
                try
                {
                    SqlCommand sqlComm = new SqlCommand(_SqlStmt.sqlStatement, sqlConn);
                    sqlComm.Transaction = sqlTransaction;
                    #region Select
                    List<Entity> entities = new List<Entity>();
                    DataTable dtTable = new DataTable();
                    SqlDataAdapter sqlAdpater = new SqlDataAdapter(sqlComm);
                    sqlAdpater.Fill(dtTable);
                    if (dtTable.Rows.Count > 0)
                    {
                        foreach (DataRow row in dtTable.Rows)
                        {
                            Entity entity = new Entity();
                            entity.EntityName = _entityName;
                            entity.Attributes = new List<Attribute>();
                            foreach (DataColumn column in dtTable.Columns)
                            {
                                Attribute attr = new Attribute();
                                attr.AttrName = column.ColumnName;
                                attr.AttrValue = row[column].ToString();
                                attr.AttrType = column.DataType.ToString();
                                entity.Attributes.Add(attr);
                            }
                            entities.Add(entity);
                        }
                        opRes.Success = true;
                        opRes.RetVal = entities;
                    }
                    #endregion

                    sqlTransaction.Commit();
                    opRes.Success = true;
                }
                catch (Exception exc)
                {
                    opRes.ErrMessage = exc.Message;
                    if (exc.InnerException != null)
                    {
                        opRes.ErrMessage = exc.InnerException.Message;
                    }
                    sqlTransaction.Rollback();
                }
            }
            catch (Exception exc)
            {
                opRes.ErrMessage = exc.Message;
                if (exc.InnerException != null)
                {
                    opRes.ErrMessage = exc.InnerException.Message;
                }
            }

            return opRes;
        }


    }
}
