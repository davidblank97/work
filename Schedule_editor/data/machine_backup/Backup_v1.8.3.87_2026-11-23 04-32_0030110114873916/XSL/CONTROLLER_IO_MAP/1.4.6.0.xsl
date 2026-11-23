<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="yes" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="iomap/power/io[@module='JASPER']/metalbeam_duty_cycle" />

  <xsl:template match="iomap/firmware_version/control_board">
	<xsl:copy>
	   <xsl:value-of select="'2.27.5'"/>
	</xsl:copy>
  </xsl:template> 
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>