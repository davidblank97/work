<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="user_preferences/preference[@tag='gas_flow_setpoint']/@tag">  
    <xsl:attribute name="tag">
	    <xsl:value-of select="'shield_gas_flow_setpoint'"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="/user_preferences">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <preference tag="trail_gas_flow_setpoint" value="0.000000"/>
      <preference tag="plasma_gas_flow_setpoint" value="0.000000"/>
      <preference tag="backup_gas_flow_setpoint" value="0.000000"/>
    </xsl:copy>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>