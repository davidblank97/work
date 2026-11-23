<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/sched[@head='K' 
								or @head='K-104' 
								or @head='K-110' 
								or @head='K-116' 
								or @head='K-123' 
								or @head='K-125' 
								or @head='K-129' 
								or @head='K-130' 
								or @head='K-131' 
								or @head='K-132' 
								or @head='K-133']/@head" >
		<xsl:attribute name="head">
			<xsl:value-of select="'K-MIG'"/>
		</xsl:attribute>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>