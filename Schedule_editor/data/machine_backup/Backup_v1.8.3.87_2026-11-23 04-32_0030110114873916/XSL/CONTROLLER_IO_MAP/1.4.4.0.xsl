<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/auxiliary_power/io[@module='JASPER']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			 <contactor_status offset="39" bit="9" />
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>