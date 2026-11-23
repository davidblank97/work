<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="UnitData" >
       <xsl:variable name="localeID" select="./@localeID"/>
       <xsl:choose>
	      <!-- Add xsl:when for each localeID -->
        <xsl:when test="$localeID='en-CA'">
	      <!-- Add your localeID specific Transformations below this line -->

        </xsl:when>
        <xsl:otherwise></xsl:otherwise>
       </xsl:choose>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>