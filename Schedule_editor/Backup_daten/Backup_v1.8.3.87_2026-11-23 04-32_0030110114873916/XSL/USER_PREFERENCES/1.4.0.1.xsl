<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="user_preferences/preference/@tag" >
    <xsl:variable name="oldMotionFilterTagName" select="'motion_filter_moving_average_size'" />
    <xsl:variable name="oldPowersupplyFilterTagName" select="'power_supply_filter_moving_average_size'" />
    <xsl:attribute name="tag">
      <xsl:choose>
       <xsl:when test=". = $oldMotionFilterTagName">data_logger_motion_filter_moving_average_size</xsl:when>
        <xsl:when test=". = $oldPowersupplyFilterTagName">data_logger_power_supply_filter_moving_average_size</xsl:when>
       <xsl:otherwise><xsl:value-of select="." /></xsl:otherwise>
      </xsl:choose>
    </xsl:attribute>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>