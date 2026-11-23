<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />

	<!-- Add your XSL Transformations below this line -->
	<xsl:template match = "/Parameters/*[last()]">
		<xsl:copy-of select="."/>
		<param id="264676">
			<name>%1 PRE POSITION</name>
			<short_name>PRE POSITION</short_name>
			<desc>The distance the ACC axis will move automatically before the weld.</desc>
		</param>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>