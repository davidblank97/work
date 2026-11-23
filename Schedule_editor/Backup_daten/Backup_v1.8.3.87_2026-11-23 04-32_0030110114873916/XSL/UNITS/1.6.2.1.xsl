<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="/UnitData/types/linear_distance/centimeters">
		<xsl:copy-of select="."/>
		<millimeters name="MILLIMETERS">
			<conversion>0.0393701</conversion>
			<symbol>mm</symbol>
		</millimeters>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>